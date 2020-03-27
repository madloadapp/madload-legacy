type MediaGraphType = 'GraphImage' | 'GraphVideo' | 'GraphSidecar';

export interface IGMediaGraph {
  __typename: MediaGraphType;
  id: string;
  shortcode: string;
  dimensions: {
    height: number;
    width: number;
  };
  display_url: string;
  display_resources: {}[];
  accessibility_caption: string;
  is_video: boolean;
  is_ad: false;
  owner: {
    id: string;
    is_verified: boolean;
    profile_pic_url: string;
    username: string;
    full_name: string;
    is_private: boolean;
    is_unpublished: boolean;
    edge_owner_to_timeline_media: { count: number };
  };
  edge_sidecar_to_children?: {
    edges: {
      node: {};
    }[];
  };
}

export interface IGMediaGraphImage extends IGMediaGraph {
  __typename: 'GraphImage';
}

export interface IGSharedData {
  entry_data: {
    PostPage: {
      graphql: {
        shortcode_media: IGMediaGraph;
      };
    }[];
  };
}
