package com.security.client.dtos;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class TargetIdentity implements Serializable {

	private static final long serialVersionUID = 1372766872282674475L;

	private String userId;
	private String userName;
	private String orgId;
	private String emailId;
	private String communityId;
	private String userDataSource;
	private String marketplaceName;
	private String userDisplayName;
	private String orgProfile;

	public TargetIdentity() {

	}

	public String toString() {
		return "Target Identifier: " + this.userId + "--" + this.orgId + "--" + this.communityId + "--"
				+ this.userDataSource + "--" + this.marketplaceName;
	}
}