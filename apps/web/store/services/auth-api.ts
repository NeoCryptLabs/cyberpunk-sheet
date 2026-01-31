import { api } from '../api';
import { gql } from 'graphql-request';

interface User {
  _id: string;
  email: string;
  username: string;
}

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  username: string;
  password: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthPayload, LoginInput>({
      query: (input) => ({
        document: gql`
          mutation Login($input: LoginInput!) {
            login(input: $input) {
              accessToken
              refreshToken
              user {
                _id
                email
                username
              }
            }
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { login: AuthPayload }) => response.login,
    }),

    register: builder.mutation<AuthPayload, RegisterInput>({
      query: (input) => ({
        document: gql`
          mutation Register($input: RegisterInput!) {
            register(input: $input) {
              accessToken
              refreshToken
              user {
                _id
                email
                username
              }
            }
          }
        `,
        variables: { input },
      }),
      transformResponse: (response: { register: AuthPayload }) => response.register,
    }),

    refreshTokens: builder.mutation<TokenPayload, string>({
      query: (refreshToken) => ({
        document: gql`
          mutation RefreshTokens($refreshToken: String!) {
            refreshTokens(refreshToken: $refreshToken) {
              accessToken
              refreshToken
            }
          }
        `,
        variables: { refreshToken },
      }),
      transformResponse: (response: { refreshTokens: TokenPayload }) => response.refreshTokens,
    }),

    logout: builder.mutation<boolean, void>({
      query: () => ({
        document: gql`
          mutation Logout {
            logout
          }
        `,
      }),
      transformResponse: (response: { logout: boolean }) => response.logout,
    }),

    me: builder.query<User, void>({
      query: () => ({
        document: gql`
          query Me {
            me {
              _id
              email
              username
            }
          }
        `,
      }),
      transformResponse: (response: { me: User }) => response.me,
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokensMutation,
  useLogoutMutation,
  useMeQuery,
} = authApi;
