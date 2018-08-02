import * as _ from 'underscore';
import { LocalStorageService } from '../services/local-storage.service';

export class PagerService {

    getPager(totalItems: number, currentPage: number = 1, pageSize: number =  3) {

        const totalPages = Math.ceil(totalItems / pageSize);

        let startPage: number, endPage: number;
        if (totalPages <= 10) {
            // less than 10 pages show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 pages calculate start & end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate indexes for start & end
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // We create array of pages to *ngFor in pager control
        const pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}
