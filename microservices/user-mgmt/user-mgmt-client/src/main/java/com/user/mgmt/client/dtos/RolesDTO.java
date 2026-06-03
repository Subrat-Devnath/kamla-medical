package com.user.mgmt.client.dtos;

import com.user.mgmt.client.enums.RoleType;
import lombok.Data;

import java.io.Serializable;

@Data
public class RolesDTO implements Serializable {

    private static final long serialVersionUid = 1984390565274472633L;

    private String id;

    private RoleType name;
}
