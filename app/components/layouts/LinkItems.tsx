import { Android, AutoGraph, Google, Group, ImageSearch, Settings, SmartToy } from "@mui/icons-material";
import { FC } from "react";
import LinkItem from "../elements/LinkItem";
import { LOCAL } from "../../utils/env";

export const LinkItems1: FC = () => {
  const billing = process.env.NEXT_PUBLIC_URL_GCP_BILLING;
  return (
    <>
      <LinkItem href="/" text="メトリクス" ico={<AutoGraph />} />
      <LinkItem href="/original" text="オリジナル画像" ico={<ImageSearch />} />
      <LinkItem href="/converted" text="画質変換した画像" ico={<ImageSearch />} />
      <LinkItem href="/retrainAI" text="AIモデル再学習" ico={<SmartToy />} />
      {/* <LinkItem href="/settings" text="設定" ico={<Settings />} /> */}
      {/* {LOCAL && <LinkItem href="/dev" text="for development" ico={<Android />} />} */}
      <LinkItem href="/vertexAiDatasets" text="AIモデル一覧" ico={<SmartToy />} />
      <LinkItem href="/dev" text="Demo: プレ運用" ico={<Android />} />
      {billing && <LinkItem href={billing} text="Billing Dashboard" ico={<Google />} />}
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
