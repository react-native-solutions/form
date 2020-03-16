#import "EmptyReanimatedView.h"

#import <React/RCTViewManager.h>

@interface EmptyReanimatedViewManager : RCTViewManager {
  CMMotionManager *_motionManager;
}

@end

@implementation EmptyReanimatedViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onTestEventChange, RCTBubblingEventBlock)

- (UIView *)view
{
  self->_motionManager = [[CMMotionManager alloc] init];
  
  return [[EmptyReanimatedView alloc] init];
}

RCT_EXPORT_METHOD(startUpdates) {
    [self->_motionManager startGyroUpdates];

    /* Receive the gyroscope data on this block */
    [self->_motionManager startGyroUpdatesToQueue:[NSOperationQueue mainQueue]
                                      withHandler:^(CMGyroData *gyroData, NSError *error)
     {
         double x = gyroData.rotationRate.x;
         double y = gyroData.rotationRate.y;
         double z = gyroData.rotationRate.z;
         double timestamp = gyroData.timestamp;

         NSLog(@"Updated gyro values: %f, %f, %f, %f", x, y, z, timestamp);
     }];

}

RCT_EXPORT_METHOD(stopUpdates) {
    [self->_motionManager stopGyroUpdates];
}


@end
