package com.user.mgmt.repository.entity;

import com.user.mgmt.repository.enums.OrgProfile;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlTransient;
import java.io.Serializable;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "organization")
public class OrganizationEntity implements Serializable {

    private static final long serialVersionUID = 1984390565274472613L;

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "shortName")
    private String shortName;

    @Column(name = "address")
    private String address;

    @Column(name = "address2")
    private String address2;

    @Column(name = "city")
    private String city;

    @Column(name = "country")
    private String country;

    @Column(name = "webSiteURL")
    private String webSiteURL;

    @Column(name = "state")
    private String state;

    @Column(name = "zip")
    private String zip;

    @Column(name = "phoneNumber")
    private String phoneNumber;

    @Column(name = "is_enabled")
    private boolean isEnabled;

    @XmlTransient
    @Column(name = "created_date")
    private Timestamp createdDate;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "is_test_org")
    private boolean isTestOrg;

    @Column(name = "org_profile")
    @Enumerated(EnumType.STRING)
    private OrgProfile orgProfile;

    @Column(name = "updated_date")
    private Long updatedDate = System.currentTimeMillis();

    @Column(name = "org_loggedin_time")
    private Long orgLoggedinTime;


}