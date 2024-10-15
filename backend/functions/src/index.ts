import * as admin from "firebase-admin";
admin.initializeApp();

export {analyzeSolution} from './ai-survivor/analyze-solution'
export {analyzePhoto} from './ethylotest/analyze-photo'