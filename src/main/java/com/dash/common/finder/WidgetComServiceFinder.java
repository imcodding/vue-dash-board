package com.dash.common.finder;

import com.dash.widget.com.service.WidgetComService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author sooyun
 * @since 2024.12.12
 */
@Component
public class WidgetComServiceFinder {
    public final List<WidgetComService> widgetComServices;

    @Value("${netis.version}")
    private String version;

    public WidgetComServiceFinder(List<WidgetComService> widgetComServices) {
        this.widgetComServices = widgetComServices;
    }

    public WidgetComService find() {
        return widgetComServices.stream()
                .filter(service -> service.getVersion().equals(version))
                .findAny()
                .orElseThrow(RuntimeException::new);
    }
}
