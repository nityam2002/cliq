import { Program, ProgramPromoter } from "../../entities";
import { ProgramSummarySheet, ProgramWorkbook, PromoterSheet } from "@org-quicko/cliq-sheet-core/Program/beans";
import { PromoterAggregatedMetrics, PromoterTableConverter } from "./promoter.table.converter";
import { dateFormatEnum } from "../../enums";
import { ProgramSummaryListConverter } from "./program_summary.list.converter";
import { ConverterException } from "@org-quicko/core";

export interface ProgramSummaryMetrics {
        totalSignUps: number;
        totalPurchases: number;
        totalRevenue: number;
        totalSignUpCommission: number;
        totalPurchaseCommission: number;
}

export class ProgramWorkbookConverter {

	private promoterTableConverter: PromoterTableConverter;
	
	private programSummaryListConverter: ProgramSummaryListConverter;

	constructor() {
		this.promoterTableConverter = new PromoterTableConverter();
		this.programSummaryListConverter = new ProgramSummaryListConverter();
	}

	/** For getting promoters report for a program */
	convertFrom(
		programId: string,
                program: Program | null,
                programPromoters: ProgramPromoter[],
                summaryMetrics: ProgramSummaryMetrics,
                promoterMetricsMap: Map<string, PromoterAggregatedMetrics>,
                startDate: Date,
                endDate: Date,
        ): ProgramWorkbook {
                try {
                        const programWorkbook = new ProgramWorkbook();

                        //  PROGRAM SUMMARY SHEET
                        const dateFormat = program?.dateFormat ?? dateFormatEnum.DD_MM_YYYY;
                        const programSummarySheet = new ProgramSummarySheet();
                        const programSummaryList = this.programSummaryListConverter.convertFrom({
                                startDate,
                                endDate,
                                programId,
                                numPromoters: programPromoters.length,
                                program,
                                totalSignUps: summaryMetrics.totalSignUps,
                                totalPurchases: summaryMetrics.totalPurchases,
                                totalSignUpCommission: summaryMetrics.totalSignUpCommission,
                                totalPurchaseCommission: summaryMetrics.totalPurchaseCommission,
                                totalRevenue: summaryMetrics.totalRevenue,
                                dateFormat,
                        });
                        programSummarySheet.replaceBlock(programSummaryList);

                        // PROMOTER SHEET
                        const promoterSheet = new PromoterSheet();
                        const promoterTable = this.promoterTableConverter.convertFrom(
                                programPromoters,
                                promoterMetricsMap,
                        );
                        promoterSheet.replaceBlock(promoterTable);
	
                        // Replace existing blank sheets
                        programWorkbook.replaceSheet(programSummarySheet);
			programWorkbook.replaceSheet(promoterSheet);

			return programWorkbook;
			
		} catch (error) {
			throw new ConverterException('Failed to convert to Program Workbook', error);
		}

	}
}