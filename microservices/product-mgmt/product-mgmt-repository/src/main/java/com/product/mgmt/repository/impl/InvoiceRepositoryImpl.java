package com.product.mgmt.repository.impl;

import com.common.service.configuration.ObjectBuilder;
import com.common.service.configuration.ObjectMapperUtils;
import com.common.service.utils.CommonUtils;
import com.product.mgmt.repository.InvoiceRepository;
import com.product.mgmt.repository.dao.InvoiceDAO;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.InvoiceDTO;
import com.product.mgmt.repository.entity.InvoiceEntity;
import com.product.mgmt.repository.entity.InvoiceEntityId;
import com.security.config.utils.SecurityUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InvoiceRepositoryImpl implements InvoiceRepository {

    @Autowired
    private InvoiceDAO invoiceDAO;

    @Override
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {

        if (invoiceDTO.getInvoiceNumber() == null) {
            invoiceDTO.setInvoiceNumber(UUID.randomUUID().toString());
        }

        SecurityUtil.setCreationDetails(invoiceDTO);

        InvoiceEntity invoiceEntity = ObjectBuilder.buildDtoFromEntity(invoiceDTO, null, InvoiceEntity.class);

        InvoiceEntityId invoiceEntityId = ObjectBuilder.buildDtoFromEntity(invoiceDTO, null, InvoiceEntityId.class);
        invoiceEntityId.setOrganizationId(SecurityUtil.getPrincipal().getOrgId());

        invoiceEntity.setInvoiceEntityId(invoiceEntityId);

        invoiceDAO.save(invoiceEntity);

        return invoiceDTO;
    }

    @Override
    public DataWithPaginationResponse getInvoicesByOrganization(String organizationId, Integer pageSize, String pageState) {

        // Parse pageNumber from pageState (if null, default to 0)
        int pageNumber = CommonUtils.getPageNumber(pageState);

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<InvoiceEntity> invoiceEntities = invoiceDAO.findByInvoiceEntityIdOrganizationId(organizationId, pageable);

        return getDataWithPaginationResponse(invoiceEntities, pageNumber);
    }

    @Override
    public DataWithPaginationResponse searchInvoiceWithPagination(String organizationId, String productNameOrFormula, Integer pageSize, String pageState) {

        if (!StringUtils.hasLength(productNameOrFormula)) {
            return new DataWithPaginationResponse(Collections.emptyList(), null, false);
        }

        String start = productNameOrFormula.toUpperCase();
        String end = start + Character.MAX_VALUE;

        // Parse pageNumber from pageState (if null, default to 0)
        int pageNumber = CommonUtils.getPageNumber(pageState);

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<InvoiceEntity> invoiceEntities = invoiceDAO.searchInvoiceWithPagination(organizationId, start, end, pageable);

        return getDataWithPaginationResponse(invoiceEntities, pageNumber);
    }

    private DataWithPaginationResponse getDataWithPaginationResponse(Page<InvoiceEntity> invoiceEntities, int pageNumber) {

        DataWithPaginationResponse response = new DataWithPaginationResponse();

        if (invoiceEntities == null || !invoiceEntities.hasContent()) {
            response.setData(Collections.emptyList());
            response.setHasNext(false);
            return response;
        }

        List<InvoiceDTO> invoiceDTOList = getNonDeletedInvoices(invoiceEntities);

        response.setData(invoiceDTOList);

        // Check if next page exists
        if (!invoiceEntities.hasNext()) {
            response.setHasNext(false);
            return response;
        }

        // Set next page state as the next page number
        response.setNextPageState(String.valueOf(pageNumber + 1));
        response.setHasNext(true);

        return response;
    }

    private List<InvoiceDTO> getNonDeletedInvoices(Page<InvoiceEntity> invoiceEntities) {

        if (invoiceEntities == null || !invoiceEntities.hasContent()) {
            return Collections.emptyList();
        }

        ModelMapper modelMapper = ObjectMapperUtils.createAndGetModelMapper();

        return invoiceEntities.stream()
                .filter(entity -> !entity.isDeleted())
                .map(entity ->
                        ObjectBuilder.buildDtoFromEntity(modelMapper,
                                entity,
                                entity.getInvoiceEntityId(),
                                InvoiceDTO.class
                        )
                )
                .collect(Collectors.toList());
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
