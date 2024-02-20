export type ContractAddressType =
  | `${string}:${string}`
  | ""
  | `$${string}:${string}:${string}`;

export interface twitterBaseInfo {
  data: {
    user: {
      result: {
        legacy: {
          profile_image_url_https: string;
        };
      };
    };
  };
}

export interface cmcBaseInfo {
  data: {
    [key: string]: {
      platform: {
        token_address: string;
        slug: string;
      };
      symbol: string;
    };
  };
}

export interface PageInfo {
  nameText: string;
  officialLink: string;
  logoSrc: string;
  detailIntroText: string;
  introduceText: string;
  twitterLink?: string;
  twitterLogoLink?: string;
  discordLink?: string;
  discordServerId?: string;
  telegramLink?: string;
  cmcLink?: string;
  ecosystem: string;
  categories: string;
  tokenContractAddress: ContractAddressType;
  nftContractAddress: ContractAddressType;
  protocolContractAddresses: ContractAddressType;
}

export interface ProjectProps {
  error_code: number;
  payload: {
    projects:
      | {
          project_id: number;
          name: string;
          logo_url: string;
          statistics: {
            rating: number;
          };
        }[]
      | null;
  };
}

interface ProjectInfo {
  chains: number[];
  categories: number[];
  twitter: string;
  short_description: string;
  long_description: string;
  name: string;
  website_url: string;
  logo_url: string;
}

interface ContractAddress {
  name?: string;
  address: string;
  chain: string;
}

interface ProjectContracts {
  NFT: ContractAddress[];
  Token: ContractAddress[];
  "System Contract Addresses": ContractAddress[];
}

export interface ProjectJson {
  project_info: ProjectInfo;
  project_contracts: ProjectContracts;
}

export interface ResponseProps {
  error_code: number;
  error_message: string;
  trace_id: string;
}
