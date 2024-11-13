import { IUser } from "~/interfaces/common";
import {
  createFaq,
  deleteFaq,
  getAllFaqs,
  updateFaq,
} from "~/controllers/faq.controller";
import { FaqInput } from "~/types/faq.types";

export const faqResolvers = {
  Query: {
    getAllFaqs: async () => getAllFaqs(),
  },
  Mutation: {
    createFaq: async (
      _: any,
      { faqInput }: { faqInput: FaqInput },
      { user }: { user: IUser }
    ) => createFaq(faqInput, user?.id),
    updateFaq: async (
      _: any,
      { faqId, faqInput }: { faqId: string; faqInput: FaqInput }
    ) => updateFaq(faqId, faqInput),
    deleteFaq: async (_: any, { faqId }: { faqId: string }) => deleteFaq(faqId),
  },
};
