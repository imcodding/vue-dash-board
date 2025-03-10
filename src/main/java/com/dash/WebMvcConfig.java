package com.dash;

import com.dash.common.AuthCheckInterceptor;
import com.dash.common.VueServletContextListener;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import javax.servlet.ServletContextListener;
import java.io.IOException;


@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final AuthCheckInterceptor authCheckInterceptor;

//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .exposedHeaders("X-Auth-Token")
//                .allowedOrigins("http://localhost:3000","http://10.1.2.31:3000","http://10.1.2.31:8081","http://localhost:8081")
//                .allowedMethods("GET", "POST", "PUT", "DELETE");
//    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {

        registry
                .addInterceptor(authCheckInterceptor)
                .excludePathPatterns("/*")
                .addPathPatterns("/api/**") // REST API 는 반드시 '/api' 붙여서 구현할 것!
                .excludePathPatterns("/api/login/**");
    }

    /**
     * vue 와 경로 겹치지 않도록 처리
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**/*")
                .addResourceLocations("classpath:/static/**")
                .resourceChain(true)
                .addResolver(new PathResourceResolver(){
                    @Override
                    protected Resource getResource(String resourcePath, org.springframework.core.io.Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        return requestedResource.exists() && requestedResource.isReadable() ? requestedResource
                                : new ClassPathResource("/static/index.html");
                    }
                });
    }

    /**
     * vue Listener 등록
     */
    @Bean
    ServletListenerRegistrationBean<ServletContextListener> servletListener() {
        ServletListenerRegistrationBean<ServletContextListener> srb = new ServletListenerRegistrationBean<>();
        srb.setListener(new VueServletContextListener());
        return srb;
    }


}
