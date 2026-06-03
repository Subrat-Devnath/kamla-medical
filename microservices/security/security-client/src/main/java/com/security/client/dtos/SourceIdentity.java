package com.security.client.dtos;

import java.io.Serializable;
import java.util.Set;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class SourceIdentity implements Serializable {

	private static final long serialVersionUID = 2470691449195340395L;

	private Set<UUID> roleIdAndChildRoleIds;
	private Set<String> teamIds;
	private String userId;
	private String userName;
	private String orgId;
	private String orgName;
	private String emailId;
	private String communityId;
	private String userDataSource;
	private String marketplaceName;
	private String userDisplayName;
	private String locale;
	private String timeZone;
	private boolean isMasterAdmin;
	private boolean isSuperAdmin;
	private boolean isOrgAdmin;
	private boolean isCommunityOwner;

	private String firstName;
	private String lastName;

	private String licenseType;

	private String licenses;

	private String userCountry;

	private String userCountryCode;

	private String orgProfile;

	public SourceIdentity(String userId, String userName, String orgId) {
		this.userId = userId;
		this.userName = userName;
		this.orgId = orgId;
	}

	public SourceIdentity(String userId, String userName, String orgId, String communityId) {
		this.userId = userId;
		this.userName = userName;
		this.orgId = orgId;
		this.communityId = communityId;
	}

	public String toString() {
		return "Source Identifier: " + this.userId + "--" + this.orgId + "--" + this.communityId + "--"
				+ this.userDataSource + "--" + this.marketplaceName + "--" + this.locale + "--" + this.timeZone;
	}
}