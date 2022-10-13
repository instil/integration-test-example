import * as shell from "shelljs";

shell.cp("-R", "src/public/js/lib", "dist/src/public/js/");
shell.cp("-R", "src/public/fonts", "dist/src/public/fonts");
shell.cp("-R", "src/public/images", "dist/src/public/images");
shell.cp("-R", "views", "dist/views");
