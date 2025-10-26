import { SelectQueryBuilder } from 'typeorm';

const optionalExecute = (value: any, cb: CallableFunction) => {
  if (
    (Array.isArray(value) && !!value.length) ||
    (!Array.isArray(value) && !!value)
  ) {
    cb({ value, isArray: Array.isArray(value) });
  }
};

interface OptionalWhere {
  fieldName?: string;
  value?: any;
  query?: SelectQueryBuilder<any>;
}

const inEqual = (payload: OptionalWhere) => {
  optionalExecute(payload.value, ({ value, isArray }) => {
    payload.query.andWhere(
      `${payload.fieldName} ${
        isArray ? `IN (:${payload.fieldName})` : `= :${payload.fieldName}`
      }`,
      { [payload.fieldName]: value },
    );
  });
  return optionalQuery(payload.query);
};

const like = (payload: OptionalWhere) => {
  optionalExecute(payload.value, ({ value }) => {
    payload.query.andWhere(`${payload.fieldName} ILIKE :${payload.fieldName}`, {
      [payload.fieldName]: `%${value}%`,
    });
  });
  return optionalQuery(payload.query);
};

export const optionalQuery = (query: SelectQueryBuilder<any>) => {
  const inEqualNext = (payloadNext: OptionalWhere) =>
    inEqual({
      fieldName: payloadNext.fieldName,
      value: payloadNext.value,
      query: query,
    });
  const likeNext = (payloadNext: OptionalWhere) =>
    like({
      fieldName: payloadNext.fieldName,
      value: payloadNext.value,
      query: query,
    });

  return {
    inEqual: inEqualNext,
    like: likeNext,
  };
};
