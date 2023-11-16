import Foundation
import MetricCore
import React

@objc(HekaHealthPlugin)
class HekaHealthPlugin: NSObject {
  private let hekaManager = MetricManager()

  @objc
  func syncIosHealthData(
    _ apiKey: String, userUuid: String, lastSyncDate: Date? = nil,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    hekaManager.syncIosHealthData(apiKey: apiKey, userUuid: userUuid, lastSyncDate: lastSyncDate) {
      success in
      if success {
        resolve(true)
      } else {
        reject("error", "Failed to sync health data", nil)
      }
    }
  }

  @objc
  func requestAuthorization(
    _ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    hekaManager.requestAuthorization { success in
      if success {
        resolve(true)
      } else {
        reject("error", "Failed to request authorization", nil)
      }
    }
  }

  @objc
  func stopSyncing(
    _ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    hekaManager.stopSyncing { success in
      if success {
        resolve(true)
      } else {
        reject("error", "Failed to stop syncing", nil)
      }
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  static func moduleName() -> String! {
    return "HekaHealthPlugin"
  }
}
