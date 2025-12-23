import { Button } from "./ui/button";

function Footer() {
  return (
    <div className="fixed bottom-0 right-0 left-56 w-[calc(100%-224px)] border-t border-t-slate-400/15 bg-background shadow-2xl shadow-box h-12 px-5">
      <div className="flex items-center justify-between w-full h-full">
        <p className="text-sm font-light text-slate-400">v0.5</p>
        <div className="flex items-center gap-5">
          <a href={"https://ko-fi.com/xoph29"} target="_blank">
            <Button
              className="bg-[#f75058] font-semibold h-8"
              icon={<img alt="" src={"./kofi_symbol.svg"} width={20} height={20} />}
            >
              Ko-Fi
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
