package com.common.service.configuration;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author subrat
 * <p>
 * D stands for DTO
 * </p>
 * <p>
 * E stands for Entity
 * </p>
 * <p>
 * Build D(DTO) from E(Entity)
 * </p>
 * <p>
 * Build E(Entity) from D(DTO)
 * </p>
 */
public class ObjectBuilder {

    private static Logger logger = LoggerFactory.getLogger(ObjectBuilder.class);

    /**
     * <p>
     * THis method is replacement to buildDtoFromEntity methods that we write in
     * each micro service,
     * </p>
     * <p>
     * we no more need to write those method again
     * </p>
     * <p>
     * E stands for entity
     * <p/>
     * <p>
     * I stands for entityId
     * <p/>
     *
     * @param E(entity)
     * @param I(entityId) entityId of same entity
     * @param outClass
     * @return
     */
    public static <D, E, I> D buildDtoFromEntity(final E entity, final I entityId, Class<D> outClass) {
        return buildDtoFromEntity(null, entity, entityId, outClass);
    }

    /**
     * <p>
     * This method is replacement to buildDtoFromEntity methods that we write in
     * each micro service,
     * </p>
     * <p>
     * Use this method if you build LIST of DTO in loop
     * </p>
     * <p>
     * we no more need to write those method again
     * </p>
     * <p>
     * E stands for entity
     * <p/>
     * <p>
     * I stands for entityId
     * <p/>
     *
     * @param E(entity)
     * @param I(entityId) entityId of same entity
     * @param outClass
     * @return
     */
    public static <D, E, I> D buildDtoFromEntity(ModelMapper modelMapper, final E entity, final I entityId, Class<D> outClass) {

        if (entity == null) {
            return null;
        }

        if (modelMapper == null) {
            modelMapper = new ModelMapper();
        }

        // First map entity -> dto
        D dto = ObjectMapperUtils.map(modelMapper, entity, outClass);

        // Then map entityId -> same dto object
        if (entityId != null) {
            ObjectMapperUtils.map(modelMapper, entityId, dto);
        }

        return dto;
    }

    public static void setNestedValue(Object target, String path, Object value) {

        String[] parts = path.split("\\.");
        Object current = target;

        try {
            current = getNestedObject(parts, current);

            // set final field
            Field finalField = current.getClass().getDeclaredField(parts[parts.length - 1]);
            finalField.setAccessible(true);
            Class<?> fieldType = finalField.getType();
            Object convertedValue = convertStringToFieldType(value, fieldType);
            finalField.set(current, convertedValue);
        } catch (NoSuchFieldException | InvocationTargetException | IllegalAccessException | InstantiationException
                 | NoSuchMethodException e) {
            logger.error("[setNestedValue]: exception in setting nested value for path: {}, {}", path, e);
        }
    }

    private static Object getNestedObject(String[] parts, Object current) throws NoSuchFieldException,
            IllegalAccessException, InstantiationException, InvocationTargetException, NoSuchMethodException {
        for (int index = 0; index < parts.length - 1; index++) {
            Field field = null;

            field = current.getClass().getDeclaredField(parts[index]);

            field.setAccessible(true);
            Object nested = field.get(current);

            // if nested object is null, create it
            if (nested == null) {
                nested = field.getType().getDeclaredConstructor().newInstance();
                field.set(current, nested);
            }

            current = nested;
        }
        return current;
    }

    public static Object convertStringToFieldType(Object value, Class<?> type) {

        if (value == null || type == null)
            return null;

        if (type == String.class) {
            return value.toString();
        } else if (type == Long.class || type == long.class) {
            return Long.parseLong(value.toString());
        } else if (type == Integer.class || type == int.class) {
            return Integer.parseInt(value.toString());
        } else if (type == Double.class || type == double.class) {
            return Double.parseDouble(value.toString());
        } else if (type == Float.class || type == float.class) {
            return Float.parseFloat(value.toString());
        }
        return value;
    }

}