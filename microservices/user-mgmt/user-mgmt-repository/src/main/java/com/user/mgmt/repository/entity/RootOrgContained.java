package com.user.mgmt.repository.entity;

import lombok.Data;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.Serializable;

//@XmlAccessorType(XmlAccessType.NONE)
/*@MappedSuperclass
@FilterDef(name = "OrgFilter", parameters = {@ParamDef(name = "allowedOrgIdList", type = String.class)})
@Filter(name = "OrgFilter", condition = "ORG_ID in (:allowedOrgIdList)")*/
@Data
public abstract class RootOrgContained implements Serializable {

    //@XmlTransient
    @ManyToOne
    @JoinColumn(name = "org_id", nullable = true)
    //@JsonIgnore
    private OrganizationEntity organization;


}
