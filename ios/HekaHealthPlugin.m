#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(HekaHealthPlugin, NSObject)

RCT_EXTERN_METHOD(syncIosHealthData:(NSString *)apiKey userUuid:(NSString *)userUuid lastSyncDate:(NSDate * _Nullable)lastSyncDate resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestAuthorization:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopSyncing:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end