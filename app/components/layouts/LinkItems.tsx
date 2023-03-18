import { AutoGraph, Group, ImageSearch, Settings, SmartToy } from "@mui/icons-material";
import { FC } from "react";
import LinkItem from "../elements/LinkItem";

export const LinkItems1: FC = () => {
  return (
    <>
      <LinkItem href="/" text="メトリクス" ico={<AutoGraph />} />
      <LinkItem href="/domeLight" text="ドーム照明" ico={<ImageSearch />} />
      <LinkItem href="/barLight" text="バー照明" ico={<ImageSearch />} />
      <LinkItem href="/retrainAI" text="AIモデル再学習" ico={<SmartToy />} />
      <LinkItem href="/settings" text="設定" ico={<Settings />} />
    </>
  );
};

export const LinkItems2: FC = () => {
  return <></>;
};

export const LinkItems3: FC = () => {
  return <></>;
};

export const UserMenuItems: FC = () => {
  return (
    <>
      <LinkItem href="/profile-settings" text="Profile Settings" ico={<Settings />} />
      <LinkItem href="/all-users" text="All Users" ico={<Group />} />
    </>
  );
};
