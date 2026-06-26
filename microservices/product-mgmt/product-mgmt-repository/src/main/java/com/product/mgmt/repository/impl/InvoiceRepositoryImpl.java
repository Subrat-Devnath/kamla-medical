package com.product.mgmt.repository.impl;

import com.common.service.configuration.ObjectBuilder;
import com.common.service.utils.CommonUtils;
import com.product.mgmt.repository.InvoiceRepository;
import com.product.mgmt.repository.dao.InvoiceDAO;
import com.product.mgmt.repository.dto.InvoiceDTO;
import com.product.mgmt.repository.entity.InvoiceEntity;
import com.product.mgmt.repository.entity.InvoiceEntityId;
import com.security.config.utils.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;
import java.util.UUID;

@Service
public class InvoiceRepositoryImpl implements InvoiceRepository {

    @Autowired
    private InvoiceDAO invoiceDAO;

    @Override
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {

        if (invoiceDTO.getInvoiceNumber() == null) {
            invoiceDTO.setInvoiceNumber(UUID.randomUUID().toString());
        }

        CommonUtils.setCreationDetails(invoiceDTO);

        InvoiceEntity invoiceEntity = ObjectBuilder.buildDtoFromEntity(invoiceDTO, null, InvoiceEntity.class);

        InvoiceEntityId invoiceEntityId = ObjectBuilder.buildDtoFromEntity(invoiceDTO, null, InvoiceEntityId.class);
        invoiceEntityId.setOrganizationId(SecurityUtil.getPrincipal().getOrgId());

        invoiceEntity.setInvoiceEntityId(invoiceEntityId);

        invoiceDAO.save(invoiceEntity);

        return invoiceDTO;
    }

    @Override
    public InvoiceDTO getInvoiceById(String invoiceId) {

        if (!StringUtils.hasText(invoiceId)) {
            return null;
        }

        InvoiceEntityId invoiceEntityId = new InvoiceEntityId();
        invoiceEntityId.setInvoiceNumber(invoiceId);
        invoiceEntityId.setOrganizationId(SecurityUtil.getPrincipal().getOrgId());

        Optional<InvoiceEntity> invoiceEntityOptional = invoiceDAO.findById(invoiceEntityId);

        if (invoiceEntityOptional.isEmpty()) {
            return null;
        }

        InvoiceEntity invoiceEntity = invoiceEntityOptional.get();

        if (invoiceEntity.isDeleted()) {
            return null;
        }

        InvoiceDTO invoiceDTO = ObjectBuilder.buildDtoFromEntity(invoiceEntity, null, InvoiceDTO.class);

        invoiceDTO.setInvoiceNumber(invoiceEntity.getInvoiceEntityId().getInvoiceNumber());

        return invoiceDTO;

    }
}
