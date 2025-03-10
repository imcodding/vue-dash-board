package com.dash.common.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author sooyun
 * @since 2024.12.12
 */
@Getter
@AllArgsConstructor
public enum Version {
    VER_64("6.4"),
    VER_65("6.5")
    ;
    private final String desc;
}
