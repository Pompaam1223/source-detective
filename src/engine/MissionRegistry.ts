import { MissionConfig, Mission } from '../types';
import { MISSION_001_CONFIG } from '../data/configs/mission1Config';
import { MISSION_002_CONFIG } from '../data/configs/mission2Config';
import { MISSION_003_CONFIG } from '../data/configs/mission3Config';
import { MISSION_004_CONFIG } from '../data/configs/mission4Config';
import { MISSIONS_DATA } from '../data/missions';

export class MissionRegistry {
  private static missionConfigs: Record<string, MissionConfig> = {
    m1: MISSION_001_CONFIG,
    m2: MISSION_002_CONFIG,
    m3: MISSION_003_CONFIG,
    m4: MISSION_004_CONFIG
  };

  /**
   * Get mission configuration by mission ID
   */
  static getMissionConfig(missionId: string): MissionConfig | undefined {
    return this.missionConfigs[missionId];
  }

  /**
   * Register a new mission configuration (for future missions M2-M4)
   */
  static registerMission(config: MissionConfig): void {
    this.missionConfigs[config.missionId] = config;
  }

  /**
   * Check if a mission has a dedicated MissionConfig
   */
  static hasMissionConfig(missionId: string): boolean {
    return !!this.missionConfigs[missionId];
  }

  /**
   * Get mission list metadata
   */
  static getAllMissions(): Mission[] {
    return MISSIONS_DATA;
  }

  /**
   * Get single mission metadata
   */
  static getMissionMetadata(missionId: string): Mission | undefined {
    return MISSIONS_DATA.find(m => m.missionId === missionId);
  }
}
