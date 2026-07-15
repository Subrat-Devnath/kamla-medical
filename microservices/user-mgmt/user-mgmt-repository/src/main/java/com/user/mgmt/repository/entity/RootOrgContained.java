package com.user.mgmt.repository.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlTransient;
import java.io.Serializable;

@XmlAccessorType(XmlAccessType.NONE)
@MappedSuperclass
@FilterDef(name = "OrgFilter", parameters = @ParamDef(name = "allowedOrgIdList", type = String.class))
@Filter(name = "OrgFilter", condition = "org_id in (:allowedOrgIdList)")
@Data
public abstract class RootOrgContained implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlTransient
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "org_id")
    private OrganizationEntity organization;
}