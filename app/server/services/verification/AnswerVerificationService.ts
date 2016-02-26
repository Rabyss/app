


import { Kind } from "../../../common/models/questions/Kind";
import { MultipleChoiceVerificationService } from "./MultipleChoiceVerificationService";
import GeoVerificationService from "./GeoVerificationService";
import { OrderVerificationService } from "./ReorderVerificationService";
import Question from "../../../common/models/Question";
import TimelineVerificationService from "./TimelineVerificationService";

export class Answer {
  public data;
  public timespent: number;
}

export class AnswerVerificationService {

    static getVerifiers() {
      const verifiers = {};

      verifiers[Kind.Timeline]       = TimelineVerificationService;
      verifiers[Kind.MultipleChoice] = MultipleChoiceVerificationService;
      verifiers[Kind.Geolocation]    = GeoVerificationService;
      verifiers[Kind.Order]          = OrderVerificationService;

      return verifiers;
    }

    static getVerifier(kind) {
      const verifiers = AnswerVerificationService.getVerifiers();
      const verifier  = verifiers[kind];

      if (!AnswerVerificationService.isVerifier(verifier)) {
        return null;
      }

      return verifier;
    }

    /**
     * @param {Tile} tile
     * @param {[Answer]} answers
     *
     * @return {[number]} the array of the results: 0 for incorrect 1 for correct per question
     */
    static verifyTile(tile, answers) {
        const questionAnswers = _.zip(tile.questions, answers);

        return _.map(questionAnswers, (qa) => {
          const kind     = (<Question>qa[0]).kind;
          const verifier = AnswerVerificationService.getVerifier(kind);

          if (verifier == null) {
            console.error(`AnswerVerificationService: Got invalid question kind: ${kind}`);
            return 0;
          }

          return verifier.verifyAnswer(qa[0], qa[1]);
        });
    }

    static isVerifier(verifier) {
      return (
        verifier != null &&
        typeof verifier.verifyAnswer === 'function'
      );
    }
}

interface QuestionAnswer {}
