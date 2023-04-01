import datetime
import os


def getFormatedJSTtime() -> str:
    t_delta = datetime.timedelta(hours=9)
    JST = datetime.timezone(t_delta, "JST")
    now = datetime.datetime.now(JST)
    return now.strftime("%Y%m%d%H%M%S")


def get_filename(fullpath: str) -> str:
    return os.path.splitext(os.path.basename(fullpath))[0]
