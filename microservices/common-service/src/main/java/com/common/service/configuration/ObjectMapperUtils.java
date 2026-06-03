package com.common.service.configuration;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;

/**
 * 
 * @author subrat
 * @version 1.0
 * @date 01/01/2026
 */
public class ObjectMapperUtils {

	// YSP-49769: Utility method to get a thread-local ModelMapper instance
	public static ModelMapper createAndGetModelMapper() {
		return threadLocalModelMapper.get();
	}

	// YSP-49769: Create a thread-safe ModelMapper using ThreadLocal
	private static final ThreadLocal<ModelMapper> threadLocalModelMapper = ThreadLocal.withInitial(() -> {
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
		return modelMapper;
	});

	/*
	 * YSP-49769: Remove the ModelMapper instance from ThreadLocal after conversion
	 * is done
	 */
	public static void clearModelMapper() {
		threadLocalModelMapper.remove();
	}

	/**
	 * Hide from public usage.
	 */
	private ObjectMapperUtils() {
	}

	/**
	 * <p>
	 * Note: outClass object must have default constructor with no arguments
	 * </p>
	 *
	 * @param <D>      type of result object.
	 * @param <T>      type of source object to map from.
	 * @param entity   entity that needs to be mapped.
	 * @param outClass class of result object.
	 * @return new object of <code>outClass</code> type.
	 */
	public static <D, T> D map(final T entity, Class<D> outClass) {
		return map(null, entity, outClass);
	}

	public static <D, T> D map(ModelMapper modelMapper, final T entity, Class<D> outClass) {
		if (modelMapper == null) {
			modelMapper = createAndGetModelMapper();
		}
		return modelMapper.map(entity, outClass);
	}

	/**
	 * <p>
	 * Note: outClass object must have default constructor with no arguments
	 * </p>
	 *
	 * @param entityList list of entities that needs to be mapped
	 * @param outCLass   class of result list element
	 * @param <D>        type of objects in result list
	 * @param <T>        type of entity in <code>entityList</code>
	 * @return list of mapped object with <code><D></code> type.
	 */
	public static <D, T> List<D> mapAll(final Collection<T> entityList, Class<D> outCLass) {
		ModelMapper modelMapper = createAndGetModelMapper();
		return entityList.stream().map(entity -> map(modelMapper, entity, outCLass)).collect(Collectors.toList());
	}

	/**
	 * Maps source to destination
	 *
	 * @param source      object to map from
	 * @param destination object to map to
	 */
	public static <S, D> D map(final S source, D destination) {
		return map(null, source, destination);
	}

	public static <S, D> D map(ModelMapper modelMapper, final S source, D destination) {
		if (modelMapper == null) {
			modelMapper = createAndGetModelMapper();
		}
		modelMapper.map(source, destination);
		return destination;
	}

	public static <S, D> ModelMapper configureModelMapper(Class<S> sourceClass, Class<D> destinationClass) {
		ModelMapper modelMapper = new ModelMapper();

		modelMapper.getConfiguration().setFieldMatchingEnabled(true).setMatchingStrategy(MatchingStrategies.LOOSE);

		for (Field sourceField : sourceClass.getDeclaredFields()) {
			NestedTargetField annotation = sourceField.getAnnotation(NestedTargetField.class);
			if (annotation != null) {
				String sourceFieldName = sourceField.getName();
				String destinationPath = annotation.value();

				// Register dynamic property mapping
				modelMapper.typeMap(sourceClass, destinationClass).addMapping(ctx -> {
					try {
						Field f = sourceClass.getDeclaredField(sourceFieldName);
						f.setAccessible(true);
						return f.get(ctx);
					} catch (Exception e) {
						return null;
					}
				}, (dest, value) -> setNestedValue(dest, destinationPath, value));
			}
		}

		return modelMapper;
	}

	private static void setNestedValue(Object target, String path, Object value) {
		try {
			String[] parts = path.split("\\.");
			Object current = target;
			for (int i = 0; i < parts.length - 1; i++) {
				Field field = current.getClass().getDeclaredField(parts[i]);
				field.setAccessible(true);
				Object nested = field.get(current);
				if (nested == null) {
					nested = field.getType().getDeclaredConstructor().newInstance();
					field.set(current, nested);
				}
				current = nested;
			}
			Field finalField = current.getClass().getDeclaredField(parts[parts.length - 1]);
			finalField.setAccessible(true);
			finalField.set(current, value);
		} catch (Exception e) {
			// Log or ignore
		}
	}
}