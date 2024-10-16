import * as admin from "firebase-admin";
admin.initializeApp();

import {analyzeSolution} from './ai-survivor/analyze-solution'
import {iaPlayRound} from './morpion/ia-play-round'
import {getScenarios} from './ai-survivor/get-scenarios'
import {getDrinks} from './barcadia/get-drinks'

exports.analyzeSolution = analyzeSolution
exports.iaPlayRound = iaPlayRound
exports.getScenarios = getScenarios
exports.getDrinks = getDrinks