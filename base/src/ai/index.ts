/**
 * AI NPC Module - Entry point
 * Provides AI-controlled NPC functionality using Character objects
 */

// Export NPC Builder
export { NPCBuilder } from './NPCBuilder';

// Export AI behaviors
export {
  IdleBehavior,
  PatrolBehavior,
  ChaseBehavior,
  FleeBehavior,
  AttackBehavior,
  WanderBehavior,
  FollowBehavior
} from './behaviors';

// Export types
export type {
  NPC,
  NPCState,
  NPCType,
  NPCCreationOptions,
  AIBehavior,
  AIBehaviorConfig,
  AIContext,
  NPCDialog,
  NPCDialogChoice
} from './types';
