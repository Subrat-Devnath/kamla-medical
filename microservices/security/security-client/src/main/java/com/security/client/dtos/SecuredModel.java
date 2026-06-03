package com.security.client.dtos;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class SecuredModel implements Serializable {

	private static final long serialVersionUID = -4992363608305003752L;

	private SourceIdentity sourceIdentity;
	private TargetIdentity targetIdentity;
	private String thirdPartyToken;
	private String yagnaJwtToken;
	private Set<String> scopes;
	private Map<String, String> contextDetails = new HashMap<String, String>();
	private String requestTrackingId;
	private String registryPath;
	private String loginMechanism;
	private String tokenStatus;
	private String issuer;
	private String tokenType;
	private UUID tokenId;
	private Date tokenExpiry;
	private Boolean isLicenseEnabled;
	private Set<String> licenseNumbers;
	private Map<String, Map<String, String>> thirdPartyAppProviderTokenMap;

	public SecuredModel(SourceIdentity sourceIdentity, TargetIdentity targetIdentity) {
		this.sourceIdentity = sourceIdentity;
		this.targetIdentity = targetIdentity;
	}

	public SecuredModel(SourceIdentity sourceIdentity, TargetIdentity targetIdentity, String thirdPartyToken) {
		this.sourceIdentity = sourceIdentity;
		this.targetIdentity = targetIdentity;
		this.thirdPartyToken = thirdPartyToken;
	}
}