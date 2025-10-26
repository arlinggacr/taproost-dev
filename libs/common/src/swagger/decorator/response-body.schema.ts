import { HttpStatus, Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";

interface SerializerArgs<T> {
  type?: T;
  status?: HttpStatus;
  description?: string;
  isBooleanResponse?: boolean;
}

export const ApiResponseBody = <T extends Type<unknown>>(
  args: SerializerArgs<T>
) => {
  const data = args.isBooleanResponse
    ? {
        type: "boolean",
        readonly: true,
        default: true,
      }
    : {
        type: "object",
        $ref: getSchemaPath(args.type),
      };

  return applyDecorators(
    ApiExtraModels(args.type ?? Function),
    ApiResponse({
      status: args.status ?? HttpStatus.OK,
      description: args.description,
      schema: {
        properties: {
          isSuccess: {
            type: "boolean",
            readOnly: true,
            default: true,
          },
          data: data,
          statusCode: {
            type: "number",
            readOnly: true,
            default: args.status ?? HttpStatus.OK,
          },
        },
      },
    })
  );
};
