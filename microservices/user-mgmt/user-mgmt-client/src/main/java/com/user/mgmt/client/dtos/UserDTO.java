package com.user.mgmt.client.dtos;

import java.io.Serializable;
import java.util.Set;

import com.user.mgmt.client.enums.Provider;
import lombok.Data;

@Data
public class UserDTO implements Serializable {

    // fixed constant name to match serialization convention
    private static final long serialVersionUID = 1984390565274472623L;

    private String companyName;

    private String id;

    private String name;

    private String emailId;

    private String city;

    private String country;

    private String password;

    private String passwordSecret;

    private boolean isActive;

    private boolean isDeleted;

    private int retryCount;

    private Long lastLoginDate = System.currentTimeMillis();

    //Default provider is local, if user is created by other provider like google, facebook etc. then this field will be updated accordingly.
    private Provider provider = Provider.LOCAL;

    private String organizationId;

    private OrganizationDTO organization;

    private Set<RolesDTO> roles;

}
