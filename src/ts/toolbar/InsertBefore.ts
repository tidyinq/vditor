import beforeSVG from "../../assets/icons/before.svg";
import {Constants} from "../constants";
import {getEventName} from "../util/compatibility";
import {execAfterRender} from "../util/fixBrowserBehavior";
import {hasClosestBlock} from "../util/hasClosest";
import {getEditorRange, setRangeByWbr} from "../util/selection";
import {MenuItem} from "./MenuItem";
import {highlightToolbar} from "../wysiwyg/highlightToolbar";
import {highlightToolbar as highlightToolbarIR} from "../ir/highlightToolbar";

export class InsertBefore extends MenuItem {
    constructor(vditor: IVditor, menuItem: IMenuItem) {
        super(vditor, menuItem);
        this.element.children[0].innerHTML = menuItem.icon || beforeSVG;
        this.element.children[0].addEventListener(getEventName(), (event) => {
            event.preventDefault();
            if (this.element.firstElementChild.classList.contains(Constants.CLASS_MENU_DISABLED) ||
                vditor.currentMode === "sv") {
                return;
            }
            const range = getEditorRange(vditor[vditor.currentMode].element);
            const blockElement = hasClosestBlock(range.startContainer);
            if (blockElement) {
                blockElement.insertAdjacentHTML("beforebegin", `<p data-block="0">${Constants.ZWSP}<wbr>\n</p>`);
                setRangeByWbr(vditor[vditor.currentMode].element, range);
                if (vditor.currentMode === "ir") {
                    highlightToolbarIR(vditor);
                } else {
                    highlightToolbar(vditor);
                }
                execAfterRender(vditor);
            }
        });
    }
}
