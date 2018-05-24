export interface KeycloakConfig {
    url?: string;
    realm?: string;
    clientId?: string;
    credentials?: { secret: string };
}
