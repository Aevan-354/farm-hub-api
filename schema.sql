-- USERS

CREATE TABLE IF NOT EXISTS public.users
(
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(16) COLLATE pg_catalog."default" NOT NULL,
    profile_image text COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
    CONSTRAINT users_phone_key UNIQUE (phone)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;
	

-- LANDS

CREATE TABLE IF NOT EXISTS public.lands
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    owner_id integer NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    location character varying(255) COLLATE pg_catalog."default" NOT NULL,
    soilType character varying(255) COLLATE pg_catalog."default" NOT NULL,
    roadAccess character varying(255) COLLATE pg_catalog."default" NOT NULL,
    waterAvailability character varying(255) COLLATE pg_catalog."default" NOT NULL,
    electricity character varying(255) COLLATE pg_catalog."default" NOT NULL,
    marketFacilities character varying(255) COLLATE pg_catalog."default" NOT NULL,
    internetAvailability character varying(255) COLLATE pg_catalog."default" NOT NULL,
    size numeric(10,2) NOT NULL,
    price numeric(10,2) NOT NULL,
    available boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image_url text COLLATE pg_catalog."default",
    is_in_marketplace boolean DEFAULT false,
    CONSTRAINT lands_pkey PRIMARY KEY (id),
	CONSTRAINT owner_fkey FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.lands
    OWNER to postgres;

--- BIDS

CREATE TABLE IF NOT EXISTS public.bids(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    bid_price numeric,
    status character varying COLLATE pg_catalog."default" DEFAULT 'open'::character varying,
    land_id integer NOT NULL,
    user_id integer,
    won boolean DEFAULT false,
    CONSTRAINT bids_pkey PRIMARY KEY (id),
    CONSTRAINT lands_fkey FOREIGN KEY (land_id)
        REFERENCES public.lands (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT users_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.bids
    OWNER to postgres;

-- PAYMENTS

CREATE TABLE IF NOT EXISTS public.payments
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer NOT NULL,
    land_id integer NOT NULL,
    amount integer NOT NULL,
    payment_method character varying(50) COLLATE pg_catalog."default" NOT NULL,
    status character varying(20) COLLATE pg_catalog."default" NOT NULL DEFAULT 'pending'::character varying,
    transaction_id character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_pkey PRIMARY KEY (id),
    CONSTRAINT payments_transaction_id_key UNIQUE (transaction_id),
    CONSTRAINT payments_land_id_fkey FOREIGN KEY (land_id)
        REFERENCES public.lands (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT payments_payment_method_check CHECK (payment_method::text = ANY (ARRAY['mpesa'::character varying, 'bank'::character varying]::text[])),
    CONSTRAINT payments_status_check CHECK (status::text = ANY (ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.payments
    OWNER to postgres;
