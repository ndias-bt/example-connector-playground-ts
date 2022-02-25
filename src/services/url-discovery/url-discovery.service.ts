import {
  Injectable, Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class UrlDiscoveryService {

  private readonly logger = new Logger(UrlDiscoveryService.name);

  constructor(private config: ConfigService) {}

  async getConnectorUrl() {

    const defaultConnectorUrl = this.config.get('url');
    const connectorName = this.config.get('name');

    let cloudRunConnectorUrl = null;

    if (process.env.K_SERVICE) { // deployed on cloud run
      cloudRunConnectorUrl = await this.getCloudRunConnectorUrl(connectorName);
    }

    if (cloudRunConnectorUrl !== null) {
      this.logger.log('Using cloud run connector url: ' + cloudRunConnectorUrl);
      return cloudRunConnectorUrl;
    } else {
      this.logger.log('Using default connector url: ' + defaultConnectorUrl);
      return defaultConnectorUrl;
    }

  }

  async getCloudRunConnectorUrl(connectorName: string): Promise<string> {
    this.logger.log('Requesting cloud run url for connector ' + connectorName);

    // TODO: put this default in a config file, with way to override
    const connectorFarmProjectId = 'connector-registry-poc';

    const run = google.run('v1');

    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const authClient = await auth.getClient();
    google.options({auth: authClient});

    const params = {
      parent: `namespaces/${connectorFarmProjectId}`,
      watch: false,
    };

    // NOTE: we use services.list instead of services.get here
    //  b/c the run api is coded to hit the global run.googleapis.com
    //  endpoint instead of the regional endpoints, and the global
    //  endpoint is restricted to list calls only
    //
    //  This is a security risk, since any connector would be able
    //  to retrieve other connectors registered in the same namespace.
    //
    //  TODO: replace this with a services.get call, or other method
    //  that fetches url for the specific connector only.

    const results = await run.namespaces.services.list(params);

    const connectorUrls = [];

    results.data.items.forEach((item) => {
      if (item.metadata.name === connectorName) {
        connectorUrls.push(item.status.url);
      }
    });

    if (connectorUrls.length === 1) {
      this.logger.log(
        'Discovered cloud run connector url: ' + connectorUrls[0],
      );
      return connectorUrls[0];
    } else {
      this.logger.log('Errors:', connectorUrls);
      return null;
    }
  }
}