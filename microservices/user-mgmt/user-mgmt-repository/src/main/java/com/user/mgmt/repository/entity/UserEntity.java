package com.user.mgmt.repository.entity;

import com.user.mgmt.client.enums.Provider;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Data
@Entity
@Table(name = "user")
public class UserEntity extends RootOrgContained implements Serializable {

    private static final long serialVersionUID = -5649645038689214691L;

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", nullable = false)
    private String id;

    //Must be email id
    @Column(name = "name", nullable = false)
    private String name;

    //Must be email id
    @Column(name = "email_id", nullable = false, unique = true)
    private String emailId;

    @Column(name = "city")
    private String city;

    @Column(name = "country")
    private String country;

    @Column(name = "password")
    private String password;

    @Column(name = "password_secret")
    private String passwordSecret;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "retry_count")
    private int retryCount;

    @Column(name = "last_login_date")
    private Long lastLoginDate;

    //User can be created by different providers like local, google, facebook etc. This field will help to identify that.
    @Enumerated(EnumType.STRING)
    private Provider provider;

    @ManyToMany(fetch = FetchType.EAGER)// Jab user fetch karenge usi time role bhi ana chahiye
    @JoinTable(name = "user_roles", joinColumns =
    @JoinColumn(name = "user_id"), inverseJoinColumns =
    @JoinColumn(name = "role_id"))
    private Set<RolesEntity> roles;
}
