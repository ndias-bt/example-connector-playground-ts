import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';

import { CollectionReference } from '@google-cloud/firestore';
import { SettingDocument } from '../../settings/documents/setting.document';

@Injectable()
export class SettingsService {
  private logger: Logger = new Logger(SettingsService.name);

  constructor(
    @Inject(SettingDocument.collectionName)
    private settingsCollection: CollectionReference<SettingDocument>,
  ) {}

  async create({ name, value }): Promise<SettingDocument> {
    const docRef = this.settingsCollection.doc(name);
    await docRef.set({
      name: name,
      value: value,
    });
    const settingDoc = await docRef.get();
    const setting = settingDoc.data();
    return setting;
  }

  async findAll(): Promise<SettingDocument[]> {
    const snapshot = await this.settingsCollection.get();
    const settings: SettingDocument[] = [];
    snapshot.forEach((doc) => settings.push(doc.data()));
    return settings;
  }
}
