export type RewardCategory = 
  | 'SCAN_QR' 
  | 'VISIT_MERCHANT' 
  | 'BUY_PRODUCT' 
  | 'REFERRAL' 
  | 'SOCIAL_PROOF' 
  | 'CUSTOM_ACTION';

export type TaskVerificationType = 
  | 'AUTOMATIC_QR' 
  | 'MANUAL_APPROVAL' 
  | 'LOCATION_GPS' 
  | 'RECEIPT_UPLOAD';

export type RewardTaskStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

export type TargetAudienceRole = 'ALL' | 'CUSTOMERS' | 'RIDERS' | 'PROMOTORAS' | 'CLIENTS';

export interface RewardTask {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  cashRewardUSD?: number;
  category: RewardCategory;
  verificationType: TaskVerificationType;
  status: RewardTaskStatus;
  targetAudience: TargetAudienceRole;
  requirements?: string;
  qrCodeSecret?: string;
  geoLat?: number;
  geoLng?: number;
  geoRadiusMeters?: number;
  maxCompletionsPerUser?: number;
  bannerImage?: string;
  createdAt: string;
  createdBy: string;
}

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RewardSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  userRole: string;
  userEmail?: string;
  pointsAwarded: number;
  submissionData: {
    proofText?: string;
    proofImage?: string;
    qrCodeRead?: string;
    latitude?: number;
    longitude?: number;
  };
  status: SubmissionStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  submittedAt: string;
}
