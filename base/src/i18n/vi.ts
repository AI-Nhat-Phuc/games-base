/**
 * Vietnamese translations for the core engine
 * This module contains all user-facing messages and error strings in Vietnamese.
 */

export const vi = {
  errors: {
    gameNotInitialized: 'Game engine chưa được khởi tạo. Gọi initGame() trước.',
    canvasNotFound: 'Không tìm thấy phần tử canvas với id: {canvasId}',
    invalidConfig: 'Cấu hình không hợp lệ',
    assetLoadFailed: 'Không thể tải tài nguyên: {assetPath}',
    characterNotFound: 'Không tìm thấy nhân vật với id: {characterId}',
    mapNotFound: 'Không tìm thấy bản đồ với id: {mapId}',
    layerNotFound: 'Không tìm thấy lớp: {layerName}',
    invalidPosition: 'Tọa độ vị trí không hợp lệ',
    animationNotFound: 'Không tìm thấy animation: {animationName}',
    behaviorNotFound: 'Không tìm thấy hành vi: {behaviorName}',
    npcNotFound: 'Không tìm thấy NPC với id: {npcId}',
    tilesetNotLoaded: 'Tileset chưa được tải'
  },
  warnings: {
    assetAlreadyLoaded: 'Tài nguyên đã được tải: {assetPath}',
    characterAlreadyExists: 'Nhân vật với id đã tồn tại: {characterId}',
    layerAlreadyExists: 'Lớp đã tồn tại: {layerName}',
    deprecatedMethod: 'Phương thức {methodName} đã lỗi thời. Sử dụng {replacement} thay thế.'
  },
  info: {
    gameInitialized: 'Game engine khởi tạo thành công',
    gameStarted: 'Game đã bắt đầu',
    gamePaused: 'Game đã tạm dừng',
    gameResumed: 'Game đã tiếp tục',
    assetLoaded: 'Tài nguyên đã tải: {assetPath}',
    characterCreated: 'Nhân vật đã tạo: {characterId}',
    mapLoaded: 'Bản đồ đã tải: {mapId}',
    npcCreated: 'NPC đã tạo: {npcId}'
  },
  debug: {
    frameRate: 'FPS hiện tại: {fps}',
    entityCount: 'Tổng số thực thể: {count}',
    memoryUsage: 'Bộ nhớ sử dụng: {usage}MB'
  }
};
