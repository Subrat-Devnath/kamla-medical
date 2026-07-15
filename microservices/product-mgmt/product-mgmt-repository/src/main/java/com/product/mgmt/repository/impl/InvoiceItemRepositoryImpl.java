package com.product.mgmt.repository.impl;

import com.common.service.configuration.ObjectBuilder;
import com.common.service.configuration.ObjectMapperUtils;
import com.common.service.utils.CommonUtils;
import com.product.mgmt.repository.InvoiceItemRepository;
import com.product.mgmt.repository.dao.InvoiceItemDAO;
import com.product.mgmt.repository.dto.DataWithPaginationResponse;
import com.product.mgmt.repository.dto.InvoiceItemDTO;
import com.product.mgmt.repository.dto.ProductDTO;
import com.product.mgmt.repository.entity.InvoiceItemEntity;
import com.product.mgmt.repository.entity.InvoiceItemEntityId;
import com.product.mgmt.repository.entity.ProductEntity;
import com.security.config.utils.SecurityUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InvoiceItemRepositoryImpl implements InvoiceItemRepository {

    @Autowired
    private InvoiceItemDAO invoiceItemDAO;

    @Override
    public InvoiceItemDTO addItem(InvoiceItemDTO invoiceItemDTO) {

        if (invoiceItemDTO.getInvoiceItemId() == null) {
            invoiceItemDTO.setInvoiceItemId(UUID.randomUUID().toString());
        }

        SecurityUtil.setCreationDetails(invoiceItemDTO);

        invoiceItemDTO.setTotalSellPrice(invoiceItemDTO.getQuantity() * invoiceItemDTO.getUnitSellPrice());

        InvoiceItemEntity invoiceItemEntity = ObjectBuilder.buildDtoFromEntity(invoiceItemDTO, null, InvoiceItemEntity.class);

        InvoiceItemEntityId invoiceItemEntityId = ObjectBuilder.buildDtoFromEntity(invoiceItemDTO, null, InvoiceItemEntityId.class);
        invoiceItemEntityId.setOrganizationId(SecurityUtil.getPrincipal().getOrgId());

        invoiceItemEntity.setInvoiceItemEntityId(invoiceItemEntityId);

        invoiceItemDAO.save(invoiceItemEntity);

        return invoiceItemDTO;
    }

    @Override
    public DataWithPaginationResponse getInvoiceItemsByOrganization(String organizationId, String invoiceNumber, Integer pageSize, String pageState) {

        // Parse pageNumber from pageState (if null, default to 0)
        int pageNumber = CommonUtils.getPageNumber(pageState);

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<InvoiceItemEntity> invoiceItemEntities = invoiceItemDAO.findByInvoiceItemEntityIdOrganizationIdAndInvoiceItemEntityIdInvoiceNumber(organizationId, invoiceNumber, pageable);

        return getDataWithPaginationResponse(invoiceItemEntities, pageNumber);
    }


    private DataWithPaginationResponse getDataWithPaginationResponse(Page<InvoiceItemEntity> invoiceItemEntities, int pageNumber) {

        DataWithPaginationResponse response = new DataWithPaginationResponse();

        if (invoiceItemEntities == null || !invoiceItemEntities.hasContent()) {
            response.setData(Collections.emptyList());
            response.setHasNext(false);
            return response;
        }

        List<InvoiceItemDTO> invoiceItemDTOList = getNonDeletedInvoices(invoiceItemEntities);

        response.setData(invoiceItemDTOList);

        // Check if next page exists
        if (!invoiceItemEntities.hasNext()) {
            response.setHasNext(false);
            return response;
        }

        // Set next page state as the next page number
        response.setNextPageState(String.valueOf(pageNumber + 1));
        response.setHasNext(true);

        return response;
    }

    private List<InvoiceItemDTO> getNonDeletedInvoices(Page<InvoiceItemEntity> invoiceItemEntities) {

        if (invoiceItemEntities == null || !invoiceItemEntities.hasContent()) {
            return Collections.emptyList();
        }
        ModelMapper modelMapper = ObjectMapperUtils.createAndGetModelMapper();
        return invoiceItemEntities.stream().filter(entity -> !entity.isDeleted()).map(entity -> ObjectBuilder.buildDtoFromEntity(modelMapper, entity, entity.getInvoiceItemEntityId(), InvoiceItemDTO.class)).collect(Collectors.toList());
    }

    @Override
    public List<InvoiceItemDTO> getItemsByInvoiceId(String invoiceId) {

        if (!StringUtils.hasText(invoiceId)) {
            return Collections.emptyList();
        }

        List<InvoiceItemEntity> invoiceItemEntities = invoiceItemDAO.findByIdOrganizationIdAndIdInvoiceNumber(SecurityUtil.getPrincipal().getOrgId(), invoiceId);

        ModelMapper modelMapper = ObjectMapperUtils.createAndGetModelMapper();

        return invoiceItemEntities.stream().filter(entity -> entity != null && !entity.isDeleted()).map(entity -> ObjectBuilder.buildDtoFromEntity(modelMapper, entity, entity.getInvoiceItemEntityId(), InvoiceItemDTO.class)).collect(Collectors.toList());
    }
}
