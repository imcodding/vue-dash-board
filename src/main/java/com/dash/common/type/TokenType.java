package com.dash.common.type;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author sooyun
 * @since 2023.07.09
 */
@Getter
@AllArgsConstructor
public enum TokenType {
    ACCESS_TOKEN,
    REFRESH_TOKEN
}
