import { ProgramSummaryList } from "@org-quicko/cliq-sheet-core/Program/beans";
import { formatDate } from "../../utils";
import { dateFormatEnum } from "../../enums";
import { Program } from "../../entities";
import { ConverterException } from "@org-quicko/core";

export interface IProgramSummaryListConverterInput {
        startDate: Date;
        endDate: Date;
        programId: string;
        numPromoters: number;
        program: Program | null;
        totalSignUps: number;
        totalPurchases: number;
        totalSignUpCommission: number;
        totalPurchaseCommission: number;
        totalRevenue: number;
        dateFormat: dateFormatEnum;
}

export class ProgramSummaryListConverter {
	convertFrom({
		startDate,
		endDate,
		programId,
		numPromoters,
		program,
                totalSignUps,
                totalPurchases,
                totalSignUpCommission,
                totalPurchaseCommission,
                totalRevenue,
                dateFormat,
        }: IProgramSummaryListConverterInput) {
                try {
                        const programSummaryList = new ProgramSummaryList();

                        const totalPromoters = numPromoters;
                        const totalCommission = totalSignUpCommission + totalPurchaseCommission;

                        programSummaryList.addFrom(formatDate(startDate, dateFormat));
                        programSummaryList.addTo(formatDate(endDate, dateFormat));
                        programSummaryList.addPromoters(totalPromoters)
                        programSummaryList.addProgramId(programId);
                        programSummaryList.addSignups(totalSignUps);
                        programSummaryList.addCommissionOnSignups(totalSignUpCommission);
                        programSummaryList.addPurchases(totalPurchases);
                        programSummaryList.addCommissionOnPurchases(totalPurchaseCommission);
                        programSummaryList.addRevenue(totalRevenue);
                        programSummaryList.addTotalCommission(totalCommission);

			return programSummaryList;

		} catch (error) {
			throw new ConverterException('Failed to convert to ProgramSummaryList', error);
		}
	}
}