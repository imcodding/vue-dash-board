package com.dash.common.finder;

import com.dash.d3map.topo.service.D3TopologyService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author sooyun
 * @since 2024.12.12
 */
@Component
public class D3TopologyServiceFinder {
    public final List<D3TopologyService> d3TopologyServices;

    @Value("${netis.version}")
    private String version;

    public D3TopologyServiceFinder(List<D3TopologyService> d3TopologyServices) {
        this.d3TopologyServices = d3TopologyServices;
    }

    public D3TopologyService find() {
        return d3TopologyServices.stream()
                .filter(service -> service.getVersion().equals(version))
                .findAny()
                .orElseThrow(RuntimeException::new);
    }
}
