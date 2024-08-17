package com.oz.service.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
//import org.apache.poi.hssf.usermodel.HSSFWorkbook;
//import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class FileHandlerImpl {
	
	private static final String XLS = "xls";
	private static final String XLSX = "xlsx";

	
	public String judgeExtension(String fileName) {
		// ファイルの拡張子を取得する
		// https://magazine.techacademy.jp/magazine/22174
		return null;
	}
	
	/**
	 * ファイルを編集する
	 * 
	 * @param fileName 編集対象ファイル名
	 * @param fileFormat ファイルフォーマット
	 * @param stripBlankFlg 空白削除フラグ
	 * @param sortDigits ソート用桁数
	 * @param deleteSheetNoArry 削除シート番号配列
	 */
	public void editFile(String fileName, String fileFormat, boolean stripBlankFlg, int sortDigits, int[] deleteSheetNoArry) {
		
		// 編集は別名ファイル上で行わないとならない（originFileNameは開いている途中の編集不可）ため、newFileNameを生成する。
		String originFileName = fileName;
		String newFileName = fileName;
		
		switch (fileFormat) {
		case XLS:
			try {
				if (stripBlankFlg) {
					xlsStripBlank(originFileName, newFileName, fileFormat);					
				}
				// TODO ここで続けてファイル名を変えずに編集できるかが不明なので要修正！
				// （空白に続けてソートの編集をしたい場合など、newFileNameを編集できるのか不明）
				if (sortDigits > 0) {
					xlsSortRow(originFileName, newFileName, fileFormat, sortDigits);
				}
			} catch (EncryptedDocumentException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			break;
		case XLSX:
			//
			break;
		default:
			break;
		}
		
		if (deleteSheetNoArry.length > 0 
				&& (XLS.equals(fileFormat) || XLSX.equals(fileFormat))) {
			// 指定シートの削除
			deleteSheet(newFileName, deleteSheetNoArry);
		}
	}

	private void xlsStripBlank(String originFileName, String newFileName, String fileFormat) throws EncryptedDocumentException, IOException {
		// 新しいブックの作成
		try(HSSFWorkbook newXls = new HSSFWorkbook()) {
			
			Workbook oldWb = WorkbookFactory.create(new File(originFileName));
			// 1枚目のシートを取得する
			Sheet oldSheet = oldWb.getSheetAt(0);
//			Sheet oldSheet = oldWb.getSheetName("Sheet1");
			
			// 新しいシートの生成
			Sheet newSheet = newXls.createSheet("newSheet1");
			for (int i = 0; i < oldSheet.getLastRowNum() + 1; i++) {
				Row oldRow = oldSheet.getRow(i);
				short maxColNum = oldRow.getLastCellNum();
				// 新しい行の生成
				Row newRow = newSheet.createRow(i);
				
				for (int j = 0; j < maxColNum; j++) {
					Cell oldCell = oldRow.getCell(j);
					if (oldCell != null) {
						// 文字列から余白を削除する
						String strippedStr = oldCell.getStringCellValue();
						// 新しいセルを生成し、余白を削除した文字列を設定する。
						newRow.createCell(j).setCellValue(strippedStr);
					}
				}
			}
			try(FileOutputStream fos = new FileOutputStream(newFileName)) {
				//新規ファイルの出力
				newXls.write(fos);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private void xlsSortRow(String originFileName, String newFileName, String fileFormat, int sortDigits) throws EncryptedDocumentException, IOException {
		// create a new workbook 
		try(HSSFWorkbook newXls = new HSSFWorkbook()) {
			Workbook oldWb = WorkbookFactory.create(new File(originFileName));
			// 1枚目のシートを取得する
			Sheet oldSheet = oldWb.getSheetAt(0);
//			Sheet oldSheet = oldWb.getSheetName("Sheet1");
			
			// 行リスト格納用リスト
			List<List<String>> rowList = new ArrayList<>();
			
			// create a new sheet
			Sheet newSheet = newXls.createSheet("newSheet1");
			
			// 行データをリスト化する
			createRowList(oldSheet, rowList);
			// 1列目の値の後ろ**桁の昇順にソートする
			rowList.sort((x, y) -> (x.get(0).substring(x.get(0).length() - sortDigits))
					.compareTo(y.get(0).substring(y.get(0).length() - sortDigits)));
//			rowList.stream().sorted((x, y) -> (x.get(0).substring(x.get(0).length() - sortDigits))
//					.compareTo(y.get(0).substring(y.get(0).length() - sortDigits)))
//					.collect(Collectors.toList());
			// ヘッダー行をリストの先頭に移動する
			rowList.add(0, rowList.get(rowList.size() - 1));
			rowList.remove(rowList.get(rowList.size() - 1));
			
			for (int i = 0; i < rowList.size(); i++) {
				// 新しい行の生成
				Row newRow = newSheet.createRow(i);				
				for (int j = 0; j < rowList.get(i).size(); j++) {
					// 新しいセルを生成し、行リストの値を設定する。
					newRow.createCell(j).setCellValue(rowList.get(i).get(j));
				}
			}
			try(FileOutputStream fos = new FileOutputStream(newFileName)) {
				//新規ファイルの出力
				newXls.write(fos);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private void createRowList(Sheet oldSheet, List<List<String>> rowList) {
		for (int i = 0; i < oldSheet.getLastRowNum() + 1; i++) {
			List<String> cellList = new ArrayList<>();
			Row oldRow = oldSheet.getRow(i);
			short maxColNum = oldRow.getLastCellNum();
			
			for (int j = 0; j < maxColNum; j++) {
				Cell oldCell = oldRow.getCell(j);
				if (oldCell != null) {
					cellList.add(oldCell.getStringCellValue());
				}
			}
			rowList.add(cellList);
		}
	}
	
	private void deleteSheet(String fileName, int[] deleteSheetNoArry){
		Workbook wb = null;
		
		try (FileInputStream in = new FileInputStream(fileName)) {
			wb = WorkbookFactory.create(in);
			// delete the specific sheet bt sheet No 
			for (int deleteSheetNo : deleteSheetNoArry) {
				wb.removeSheetAt(deleteSheetNo);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} catch (EncryptedDocumentException e) {
			e.printStackTrace();
		}
		
		try (FileOutputStream out = new FileOutputStream(fileName)) {
			wb.write(out);	
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
