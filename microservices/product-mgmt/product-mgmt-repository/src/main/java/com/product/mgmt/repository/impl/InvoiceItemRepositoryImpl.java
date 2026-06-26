package com.product.mgmt.repository.impl;

import com.common.service.configuration.ObjectBuilder;
import com.common.service.utils.CommonUtils;
import com.product.mgmt.repository.InvoiceItemRepository;
import com.product.mgmt.repository.dao.InvoiceItemDAO;
import com.product.mgmt.repository.dto.InvoiceItemDTO;
import com.product.mgmt.repository.entity.InvoiceItemEntity;
import com.product.mgmt.repository.entity.InvoiceItemEntityId;
import com.security.config.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InvoiceItemRepositoryImpl implements InvoiceItemRepository {

    @Autowired
    private InvoiceItemDAO invoiceItemDAO;

    @Override
    public InvoiceItemDTO addItem(InvoiceItemDTO invoiceItemDTO) {

        invoiceItemDTO.setInvoiceItemId(UUID.randomUUID().toString());
        CommonUtils.setCreationDetails(invoiceItemDTO);

        InvoiceItemEntity invoiceItemEntity = ObjectBuilder.buildDtoFromEntity(invoiceItemDTO, null, InvoiceItemEntity.class);

        InvoiceItemEntityId invoiceItemEntityId = ObjectBuilder.buildDtoFromEntity(invoiceItemDTO, null, InvoiceItemEntityId.class);
        invoiceItemEntityId.setOrganizationId(SecurityUtil.getPrincipal().getOrgId());

        invoiceItemDAO.save(invoiceItemEntity);

        return invoiceItemDTO;
    }

    @Override
    public List<InvoiceItemDTO> getItemsByInvoiceId(String invoiceId) {

        if (!StringUtils.hasText(invoiceId)) {
            return Collections.emptyList();
        }

        List<InvoiceItemEntity> invoiceItemEntities = invoiceItemDAO.findByIdOrganizationIdAndIdInvoiceNumber(SecurityUtil.getPrincipal().getOrgId(), invoiceId);

        return invoiceItemEntities.stream().filter(entity -> entity != null && !entity.isDeleted())
                .map(entity -> ObjectBuilder.buildDtoFromEntity(
                        entity,
                        null,
                        InvoiceItemDTO.class))
                .collect(Collectors.toList());
    }
}
