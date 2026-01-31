import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    'src/generated/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        scalars: {
          DateTime: 'string',
          ID: 'string',
        },
        enumsAsTypes: true,
        skipTypename: true,
      },
    },
    'src/generated/schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
