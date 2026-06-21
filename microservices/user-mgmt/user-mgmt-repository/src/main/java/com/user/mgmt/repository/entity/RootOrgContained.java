package com.user.mgmt.repository.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlTransient;
import java.io.Serializable;

@XmlAccessorType(XmlAccessType.NONE)
@MappedSuperclass
@FilterDef(name = "OrgFilter", parameters = @ParamDef(name = "allowedOrgIdList", type = "string"))
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