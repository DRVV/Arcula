export type PodPhase = 'Pending' | 'Running' | 'Succeeded' | 'Failed' | 'Unknown';

export interface ClusterPod {
  id: string;                     // unique: cluster/namespace/name
  name: string;
  namespace: string;
  status: PodPhase;
  cluster?: string;
  role?: string;
}

export interface ClusterStatusPayload {
  pods: ClusterPod[];
}
