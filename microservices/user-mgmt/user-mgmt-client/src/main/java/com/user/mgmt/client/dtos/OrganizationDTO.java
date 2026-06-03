package com.user.mgmt.client.dtos;

import com.user.mgmt.repository.enums.OrgProfile;
import lombok.Data;

import java.io.Serializable;
import java.sql.Timestamp;

@Data
public class OrganizationDTO implements Serializable {

    private static final long serialVersionUID = 1984390565274472613L;

    private String id;

    private String name;

    private String shortName;

    private String address;

    private String address2;

    private String city;

    private String country;

    private String webSiteURL;

    private String state;

    private String zip;

    private String phoneNumber;

    private boolean isEnabled;

    private Timestamp createdDate;

    private boolean isDeleted;

    private boolean isTestOrg;

    private OrgProfile orgProfile;

    private Long updatedDate = System.currentTimeMillis();

    private Long orgLoggedinTime;

}