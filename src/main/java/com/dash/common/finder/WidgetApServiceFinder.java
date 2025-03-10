package com.dash.common.finder;

import com.dash.widget.ap.service.WidgetApService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author sooyun
 * @since 2024.12.12
 */
@Component
public class WidgetApServiceFinder {
    public final List<WidgetApService> widgetApServices;

    @Value("${netis.version}")
    private String version;

    WidgetApServiceFinder(List<WidgetApService> widgetApServices) {
        this.widgetApServices = widgetApServices;
    }

    public WidgetApService find() {
        return widgetApServices.stream()
                .filter(service -> service.getVersion().equals(version))
                .findAny()
                .orElseThrow(RuntimeException::new);
    }
}
